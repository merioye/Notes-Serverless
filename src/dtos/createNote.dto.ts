import { IsInt, MinLength } from "class-validator";

export class CreateNoteDto {
  @IsInt()
  id: number;

  @MinLength(3)
  title: string;

  @MinLength(10)
  body: string;
}
