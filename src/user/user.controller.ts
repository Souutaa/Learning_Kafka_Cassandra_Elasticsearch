import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserByIdQuery } from './queries/find-user-by-id.query';
import { FindUserByUsernameQuery } from './queries/find-user-by-username.query';
import { GetAllUsersQuery } from './queries/get-all-users.query';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get('/getByName')
  findByUsername(@Query('username') username: string) {
    return this.queryBus.execute(new FindUserByUsernameQuery(username));
  }

  @Get()
  findAll() {
    const userList = this.queryBus.execute(new GetAllUsersQuery());
    return userList;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new FindUserByIdQuery(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
