import * as express from "express";
import UserData from "./user.interface";
import UserNotFoundException from "../../v1/exceptions/userNotFoundException";
import * as asyncHandler from "express-async-handler";
import Controller from "../../v1/interfaces/controller.interface";
import UserService from "./user.service";
import expressAsyncHandler = require("express-async-handler");

class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  private UserService = new UserService();
  constructor() {
    this.initializeRoutes();
  }
  public initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(`${this.path}/createuser`, this.createUser);
    this.router.patch(`${this.path}/:id`, this.editUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
  }

  private getAllUsers = asyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) => {
      console.log("in get all users");
      const Users = await this.UserService.getAllUsers();
      response.status(200).json({ data: Users });
    }
  );

  private createUser = asyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) => {
      const userData: UserData = request.body;
      console.log(request.body);
      const createdUser = await this.UserService.createUser(userData);
      response.send(createdUser);
    }
  );

  private editUser = asyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) => {
      const userData: UserData = request.body;
      const id = request.params.id;
      const updatedUser = await this.UserService.editUser(id, userData);
      if (!updatedUser) return next(new UserNotFoundException(id));
      response.sendStatus(204);
    }
  );

  private deleteUser = asyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) => {
      const id = request.params.id;
      const deletedUser = await this.UserService.deleteUser(id);
      if (!deletedUser) return next(new UserNotFoundException(id));
      response.sendStatus(204);
    }
  );
}

export default UserController;
