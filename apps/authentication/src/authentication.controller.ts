import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SayHelloOuput } from '@libs/common/model/say-hello.output';
import { SayHelloInput } from '@libs/common/dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern({ cmd: 'sayHello' })
  async sayHello(@Payload() input: SayHelloInput): Promise<SayHelloOuput> {
    return await this.authenticationService.getHello(input);
  }
}
