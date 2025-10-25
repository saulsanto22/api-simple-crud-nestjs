import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from "@nestjs/common";
import { ZodObject, ZodType } from "zod";


type ZodSchemaType = ZodObject<any> | ZodType<any>;


interface ZodSchemaClass {
    schema: ZodSchemaType
}


@Injectable()
export class ZodValidationPipe implements PipeTransform {
    transform(value: unknown, metadata: ArgumentMetadata) {

        if (!metadata.metatype) return value

        if (this.isZodSchema(metadata.metatype)) {
            const schema = (metadata.metatype as unknown as ZodSchemaClass).schema;
            const result = schema.safeParse(value);

            if (!result.success) {
                throw new BadRequestException({
                    statusCode: 400,
                    message: result.error.issues
                })
            }
            return result.data;

        }
        return value;
    }

    private isZodSchema(metatype?: unknown): metatype is ZodSchemaClass {

        if (typeof metatype === 'function') return false
        const schema = (metatype as unknown as ZodSchemaClass).schema;
        return schema !== undefined && typeof schema.safeParse === 'function';
    }
}