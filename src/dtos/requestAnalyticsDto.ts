import { districtPerformaceDto } from "./districtPerformaceDto";
import { requestTrendsDto } from "./requestTrendsDto";
import { topCitiesDto } from "./topAreaDto";

export interface requestAnalyticsDto {
    trends: requestTrendsDto[]; 
    districtPerformance: districtPerformaceDto[]; 
    topCities: topCitiesDto[];
  }