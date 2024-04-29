import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService, private readonly usersService : UsersService) {}

  @Mutation(() => Room)
  createRoom(@Args('createRoomInput') createRoomInput: CreateRoomInput) {
    return this.roomsService.create(createRoomInput);
  }

  @Query(() => [Room], { name: 'rooms' })
  findAll() {
    return this.roomsService.findAll();
  }

  @Query(() => Room, { name: 'room' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.roomsService.findOne(id);
  }

  @Mutation(() => Room)
  updateRoom(@Args('updateRoomInput') updateRoomInput: UpdateRoomInput) {
    return this.roomsService.update(updateRoomInput);
  }



  @Mutation(() => Room)
  removeRoom(@Args('id', { type: () => Int }) id: number) {
    return this.roomsService.remove(id);
  }
  
  @ResolveField(()=>[User])
  async users(@Parent() room: Room) {
    return this.roomsService.getUsers(room.id);
  }
}
