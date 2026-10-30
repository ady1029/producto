package cu.aica.product_resource.api.v2.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.services.ResourceService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("v2 Resource")
@RequestMapping(ApiVersion.URL_BASE_V2)
@Api(tags = "Recursos", description = "Endpoints para el CRUD de recursos.")
public class ResourceController {

    @Autowired
    ResourceService service;

}
