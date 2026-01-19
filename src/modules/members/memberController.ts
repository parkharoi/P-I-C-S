import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MemberService } from './member.Service';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateMemberDto): Promise<void> {
    return this.memberService.signUp(createUserDto);
  }

  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateMemberDto) {
  //   return this.memberService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}
