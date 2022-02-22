import { SayHelloInput } from '@libs/common/dto';
import { SayHelloOuput } from '@libs/common/model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  async getHello(input: SayHelloInput): Promise<SayHelloOuput> {
    return { value: 'hi ' } as SayHelloOuput;
  }
}
