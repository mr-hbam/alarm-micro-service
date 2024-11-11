import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VerifyAlarmUseCase } from '../../../../core/detection/usecases';
import { NamespaceJwtAuthGuard } from '../auth/guards/namespace-jwt-auth.guard';
import { VerifyAlarmRequestDto } from './dto/alarn-detetcion.dto';

@Controller('detections')
export class DetectionController {
  constructor(private verifyAlarmUseCase: VerifyAlarmUseCase) {}

  @Post()
  @UseGuards(NamespaceJwtAuthGuard)
  async verifyAlarm(
    @Body() verifyAlarmDto: VerifyAlarmRequestDto,
  ): Promise<boolean> {
    return this.verifyAlarmUseCase.execute(verifyAlarmDto);
  }
}
