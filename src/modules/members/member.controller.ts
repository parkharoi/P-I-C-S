import { Body, Controller, Post } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateMemberDto): Promise<void> {
    return this.memberService.signUp(createUserDto);
  }
}
