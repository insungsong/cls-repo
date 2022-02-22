import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SayHelloOuput } from '@libs/common/model/say-hello.output';
import { lastValueFrom } from 'rxjs';
import { SayHelloInput } from '@libs/common/dto';

@Injectable()
export class AuthenticationProxyService {
  constructor(@Inject('AUTHENTICATION_SERVICE') private client: ClientProxy) {}
  async sayHello(input: SayHelloInput) {
    try {
      return await lastValueFrom(
        this.client.send<SayHelloOuput>({ cmd: 'sayHello' }, input),
      );
    } catch (error) {}
  }
}
