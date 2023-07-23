import { MinLength, IsString } from "class-validator";

export class UpdateNoteDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  body: string;
}
