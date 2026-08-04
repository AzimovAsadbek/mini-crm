import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard statistikasi, grafiklar va oxirgi vazifalar' })
  @ApiResponse({ status: 200, type: DashboardStatsDto })
  getStats(): Promise<DashboardStatsDto> {
    return this.dashboardService.getStats();
  }
}
