import { IsMongoId } from "class-validator";

export class IsValidObjectId {
    @IsMongoId()
    id!: string
}