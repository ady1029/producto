package cu.aica.product_resource.api.v2.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.services.ProductService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController("v2 Product")
@RequestMapping(ApiVersion.URL_BASE_V2)
@Api(tags = "Producto", description = "Endpoints para el CRUD de productos.")
public class ProductController {

    @Autowired
    ProductService service;

}
