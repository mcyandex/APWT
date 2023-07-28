import { BadRequestException, Body, Controller, ForbiddenException, Session, Patch, UseGuards, UploadedFile, UseInterceptors, ValidationPipe, UsePipes, Put, Post, Get, Param, NotFoundException, ConflictException } from "@nestjs/common"
import * as fs from 'fs-extra';
import * as bcrypt from 'bcrypt';
import { ChangePassword } from "src/models/login/login.dto"
import { LoginEntity } from "src/models/login/login.entity"
import { LoginService } from "src/models/login/login.service"
import { UserProfileDTO } from "src/models/userProfile/userProfile.dto";
import { MulterError, diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserProfileService } from "src/models/userProfile/userProfile.service";
import { ProductEntity } from "src/models/product/product.entity";
import { ProductService } from "src/models/product/product.service";
import { OrderService } from "src/models/order/order.service";
import { CustomerService } from "src/models/customer/customer.service";
import { GigService } from "src/models/gig/gig.service";
import { OrderProductsMapService } from "src/models/orderProductsMap/orderProductsMap.service";
import { GigDTO } from "src/models/gig/gig.dto";

@Controller('bandmanager')

export class BandManagerController {
  constructor(
    private readonly loginService: LoginService,
    private readonly userProfileService: UserProfileService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly customerService:CustomerService,
    private readonly orderProductsMapService: OrderProductsMapService,
    private readonly gigService: GigService,
  ) { }  

//Login
//UserProfile(Login,UserProfile)
@Post('adduserprofile')
@UsePipes(new ValidationPipe())
@UseInterceptors(
  FileInterceptor('myfile', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 8000000 },
    storage: diskStorage({
      destination: './temp/userprofile',
      filename: function (req, file, cb) {
        let name = req.body.name;
        console.log(name);
        cb(null, `${name}.${file.originalname.split('.')[1]}`);
      },
    }),
  })
)
async addUserProfile(
  @UploadedFile() myfileobj: Express.Multer.File,
  @Body() data: UserProfileDTO, @Session() session): Promise<UserProfileDTO> {
  if (!myfileobj || myfileobj.size == 0) {
    throw new BadRequestException('Empty file');
  }
  const newFileName = `${session.user.id}.${myfileobj.originalname.split('.')[1]}`;
  const destinationDir = './uploads/userprofile';
  const filePath = `${destinationDir}/${newFileName}`;

  data.image = newFileName
  data.login = session.user.id
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }
  await fs.promises.rename(myfileobj.path, filePath);
  return this.userProfileService.addUserProfile(data).catch(err => {
    throw new ConflictException({
      message: err.message
    });
  });
}

@Put('updateuserprofile')
@UsePipes(new ValidationPipe())
@UseInterceptors(
  FileInterceptor('myfile', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 8000000 },
    storage: diskStorage({
      destination: './temp/userprofile',
      filename: function (req, file, cb) {
        let name = req.body.name;
        console.log(name);
        cb(null, `${name}.${file.originalname.split('.')[1]}`);
      },
    }),
  })
)
async updateUserProfile(@UploadedFile() myfileobj: Express.Multer.File, @Body() data: UserProfileDTO, @Session() session) {
  if (myfileobj != null || myfileobj.size > 0) {
    const newFileName = `${session.user.id}.${myfileobj.originalname.split('.')[1]}`;
    const destinationDir = './uploads/userprofile';
    const filePath = `${destinationDir}/${newFileName}`;
    data.image = newFileName
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }
    await fs.promises.rename(myfileobj.path, filePath);
  }
  return this.userProfileService.updateUserProfile(session.user.id, data);
}
//ChangePassword(Login)  
@Patch('changepassword')
@UseGuards()
async resetPassword(@Body() data: ChangePassword, @Session() session) {
  if (data.password == data.reTypePassword) {
    const res: boolean = await bcrypt.compare(data.oldPassword, session.user.password)
    if (res) {
      const newData = new LoginEntity()
      newData.password = await this.loginService.getHassedPassword(data.password)
      return await this.loginService.updateUserLoginInfo(session.user.id, newData)
    }
    return new ForbiddenException({ message: "User not identified" })
  }
  return new BadRequestException({ message: "Re-typed password didnot match" })
}

//ForgetPassword(Login+Token)


//!!---Product Management---!!
//Product------------------------->view product related to bandId

// @Get('getProduct/:id')
// getProductByBandId(@Session() session, @Param('id') id:string){
//       return this.productService.getProductByBandId(session.user.id)
//     }


@Get('getProduct/:name')
async getProductByName(@Param() name: string): Promise<ProductEntity[]> {
  const data = await this.productService.getProductByName(name)
  if (data.length === 0) {
    throw new NotFoundException({ message: "No Product created yet" })
  }
  return data;
}

//!!---Order Management---!!
//Order---------------------------> view for hid bandId
// @Get('getOrder/:id')
// getOrderByBandId(@Session() session, @Param('id') id:string){
//       return this.orderService.getOrderByBandId(session.user.id)
//     }



//!!---Customer Management---!!
// Customer -------------------------------------------- view for his bandId
@Get('getCustomer/:id')
getCustomerByBandId(@Session() session, @Param('id') id:string){
      return this.customerService.getCustomerByBandId(session.user.id)
    }



//!!---Gig Management---!!
// Gig ----------------------------------------------- view upcoming gig related to bandId
// @Get('getGig/:id')
// getGigByBandId(@Session() session, @Param('id') id:string){
//       return this.gigService.getGigByBandId(session.user.id)
//     }

@Get('getGig/:name')
async getGigByName(@Param() name: string): Promise<GigDTO[]> {
  const data = await this.gigService.getGigByName(name)
  if (data.length === 0) {
    throw new NotFoundException({ message: "No Gig created yet" })
  }
  return data;
}

// !!---Reports---!! 
// 1.Sales Report ---------------------------------------- generate a PDF of total sales for bandId. 
@Get('salesreport')
async getSalesReport(@Session() session, @Param('id') id:string): Promise<any> {
  const data = await this.orderProductsMapService.getOrderProductsMapWithReportByBandId(session.user.id)
  if (data.length === 0) {
    throw new NotFoundException({ message: "No sales data available yet" })
  }
  else {
    const report = {}
    for (const item of data) {
      const id = item.productDetails.id
      const productName = item.productDetails.name
      const quantity = item.productDetails.quantity
      const sales = item.orderQuantity

      if (report.hasOwnProperty(id)) {
        report[id].productName = productName
        report[id].sales += sales;
        report[id].quantity = Math.max(report[id].quantity, quantity);
      } else {
        report[id] = {
          productName: productName,
          sales: sales,
          quantity: quantity,
        };
      }
    }
    const reportArray = Object.values(report);
    return reportArray;
  }
}
// 2.Monthly Revenue Report ------------------------- list of products sold in specific month fot bandID 
@Get('revenuereport')
async getRevenueReport(@Session() session, @Param('id') id:string): Promise<any> {
  const data = await this.orderProductsMapService.getOrderProductsMapWithReportByBandId(session.user.id)
  if (data.length === 0) {
    throw new NotFoundException({ message: "No sales data available yet" })
  }
  else {
    const report = {}
    for (const item of data) {
      const id = item.productDetails.id
      const productName = item.productDetails.name
      const price = item.productDetails.orderPrice
      const revenuePercentage = item.productDetails.product.revenuePercentage
      const quantity = item.productDetails.quantity
      const revenue = (1 - (revenuePercentage / 100)) * quantity

      if (report.hasOwnProperty(id)) {
        report[id].productName = productName
        report[id].price = Math.max(report[id].price, price);
        report[id].revenue += revenue;
        report[id].quantity = Math.max(report[id].quantity, quantity);
      } else {
        report[id] = {
          productName: productName,
          price: price,
          revenue: revenue,
          quantity: quantity,
        };
      }
    }
    const reportArray = Object.values(report);
    return reportArray;
  }
}
// 3.Bar Charts ------------------------------------------- sales by 12 months for bandid 
@Get('barchart')
async getBarChart(@Session() session, @Param('id') id:string): Promise<any> {
  const data = await this.orderProductsMapService.getOrderProductsMapWithReportByBandId(session.user.id)
  if (data.length === 0) {
    throw new NotFoundException({ message: "No sales data available yet" })
  }
  else {
    const report = {}
    for (const item of data) {
      const date = new Date(item.order.date)
      const month = date.getMonth() + 1
      const sales = item.orderQuantity

      if (report.hasOwnProperty(month)) {
        report[month].month = month
        report[month].sales += sales
      } else {
        report[month] = {
          month: month,
          sales: sales,
        };
      }
    }
    for (let month = 1; month <= 12; month++) {
      if (!report.hasOwnProperty(month)) {
        report[month] = {
          month: month,
          sales: 0
        }
      }
    }
    const reportArray = Object.values(report);
    return reportArray;
  }
}

}