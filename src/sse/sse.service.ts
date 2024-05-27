import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Response } from 'express';
import { PostEventEnum } from 'src/posts/enums/event.enum';
import { EventEnum } from 'src/users/enum/event.enum';

interface UserToSaveSse {
  userId: number;
  role: string;
}

@Injectable()
export class SseService {
  private clients: Map<UserToSaveSse, Response[]> = new Map(); //

  addClient(user: UserToSaveSse, client: Response) {
    if (!this.clients.has(user)) {
      this.clients.set(user, []);
    }
    const userClients = this.clients.get(user);
    userClients.push(client);

    client.on('close', () => {
      this.removeClient(user, client);
    });
  }

  removeClient(user: UserToSaveSse, client: Response) {
    const userClients = this.clients.get(user);
    if (userClients) {
      const index = userClients.indexOf(client);
      if (index !== -1) {
        userClients.splice(index, 1);
      }
      if (userClients.length === 0) {
        this.clients.delete(user);
      }
    }
  }

  sendEvent(user: UserToSaveSse, data: any) {
    const userClients = this.clients.get(user);
    if (userClients) {
      userClients.forEach((client) => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
      });
    }
  }

  findAllAdminUsers(): UserToSaveSse[] {
    const adminUsers: UserToSaveSse[] = [];
    for (const [user, _] of this.clients) {
      if (user.role === 'admin') {
        adminUsers.push(user);
      }
    }
    return adminUsers;
  }

  sendToAdmins(data: any) {
    const  admins = this.findAllAdminUsers();
    admins.forEach((admin) => {
      this.sendEvent(admin, data);
    });
  }

  sendToAll(data: any) {
    for (const [user, _] of this.clients) {
      this.sendEvent(user, data);
    }
  }

  sendToSpecificUser(userId: number, data: any) {
    const  userConnections = this.findConnectionsByUserId(userId);
    if (userConnections.length > 0) {
      userConnections.forEach((userConn) => {
        this.sendEvent(userConn, data);
      });
    }
  }

  findConnectionsByUserId(userId: number): UserToSaveSse[] {
    const userConnections: UserToSaveSse[] = [];
    for (const [user, _] of this.clients) {
      if (user.userId === userId) {
        userConnections.push(user);
      }
    }
    return userConnections;
  }

  @OnEvent(EventEnum.USER_CREATED)
  handleUserCreatedEvent(payload: any) {
    this.sendToAll({
      type: EventEnum.USER_CREATED,
      data: payload,
    
    });
  }

  @OnEvent(EventEnum.USER_UPDATED)
  handleUserUpdatedEvent(payload: any) {
    this.sendToAll(
      {
        type: EventEnum.USER_UPDATED,
        data: payload,
      }
    );
  }

  @OnEvent(EventEnum.USER_DELETED)
  handleUserDeletedEvent(payload: any) {
    this.sendToAll(
      {
        type: EventEnum.USER_DELETED,
        data: payload,
      }
    );
  }

  @OnEvent(PostEventEnum.POST_CREATED)
  handlePostCreatedEvent(payload: any) {
    this.sendToAll(
      {
        type: PostEventEnum.POST_CREATED,
        data: payload,
      }
    );
  }

}