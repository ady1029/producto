package cu.aica.product_resource.utils.validation;


import cu.aica.product_resource.models.ProductFamily;
import cu.aica.product_resource.models.ResourceFamily;
import cu.aica.product_resource.repositorys.ProductFamilyRepository;
import cu.aica.product_resource.repositorys.ResourceFamilyRepository;
import org.springframework.beans.factory.annotation.Autowired;


import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;


public class NameUniqueValidator implements ConstraintValidator<NameUnique, Object> {


    @Autowired
    ProductFamilyRepository productFamilyRepository;

    @Autowired
    ResourceFamilyRepository resourceFamilyRepository;

    @Override
    public boolean isValid(Object object, ConstraintValidatorContext context) {

        if (object instanceof ProductFamily){

            ProductFamily pf = (ProductFamily) object;
            ProductFamily pfResult = productFamilyRepository.findByIdEnterpriseAndName(pf.getIdEnterprise(), pf.getName());
            if (pfResult == null)
                return true;
            else
                return pfResult.getId().equals(pf.getId());

        } else if (object instanceof ResourceFamily){

            ResourceFamily rf = (ResourceFamily) object;
            ResourceFamily rfResult = resourceFamilyRepository.findByIdEnterpriseAndName(rf.getIdEnterprise(), rf.getName());

            if (rfResult == null)
                return true;
            else
                return rfResult.getId().equals(rf.getId());

        }
        return false;
    }

}