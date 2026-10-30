package cu.aica.product_resource.utils.validation;


import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({TYPE})
@Retention(RUNTIME)
@Constraint(validatedBy = NameUniqueValidator.class)
@Documented
public @interface NameUnique {

    String[] columnNames();

    String message();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
