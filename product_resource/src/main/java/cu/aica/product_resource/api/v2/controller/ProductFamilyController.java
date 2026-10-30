package cu.aica.product_resource.api.v2.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.services.ProductFamilyService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController("v2 ProductFamily")
@RequestMapping(ApiVersion.URL_BASE_V2)
@Api(tags = "Familia de producto", description = "Endpoints para el CRUD de las familias de productos.")
public class ProductFamilyController {

    @Autowired
    ProductFamilyService service;


}
