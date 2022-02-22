import { SayHelloInput } from '@libs/common/dto';
import { SayHelloOuput } from '@libs/common/model';
import { Query, Resolver, Args } from '@nestjs/graphql';
import { AuthenticationProxyService } from './authentication.proxy.service';

@Resolver('authentication')
export class AuthenticationResolver {
  constructor(
    private readonly authenticationService: AuthenticationProxyService,
  ) {}

  @Query(() => SayHelloOuput)
  async sayHello(@Args('input') input: SayHelloInput) {
    return await this.authenticationService.sayHello(input);
  }
}
