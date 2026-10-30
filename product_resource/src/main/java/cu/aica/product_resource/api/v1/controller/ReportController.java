package cu.aica.product_resource.api.v1.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.api.dto.report.*;
import cu.aica.product_resource.services.ReportService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("v1 Report")
@RequestMapping(ApiVersion.URL_BASE_V1+"/report")
@Api(tags = "Reportes", description = "Endpoints de reportes.")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/resource_by_product")
    @ApiOperation(value = "Reporte recurso por producto", notes = "Retorna la lista de familias de recusos que coinciden con los parámetros introducidos.")
    public List<ResourceFamilyDTO> resourceByProduct(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "ID de Familia de producto") Integer idProductFamily,
            @RequestParam(defaultValue = "1000") @ApiParam(value = "Cantidad de producto") Integer count
    ) {
        return reportService.resourceByProduct(idProductFamily, count);
    }


    @GetMapping("/product_by_resource")
    @ApiOperation(value = "Reporte productos por recurso", notes = "Retorna la lista de productos que coinciden con los parámetros introducidos.")
    public List<ProductFamilyDTO> productByResource(@RequestParam(defaultValue = "-1") @ApiParam(value = "ID de familia de recuso") Integer idResourceFamily) {

        return reportService.productByResource(idResourceFamily);
    }


    @GetMapping("/resource_existence")
    @ApiOperation(value = "Reporte existencia de recursos", notes = "Retorna existencia de la familia de recurso.")
    public ResourceExistenceDTO getExistence(@RequestParam(defaultValue = "-1") @ApiParam(value = "ID de familia de recuso") Integer idResourceFamily) {

        return reportService.getExistence(idResourceFamily);
    }

    @GetMapping("/simulate_demand")
    @ApiOperation(value = "Reporte simular demanda nacional", notes = "Retorna la lista de familias de recusos con la existencia en mistral .")
    public List<NationalDemandDTO> simulateDemand(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "ID de Familia de producto") Integer idProductFamily,
            @RequestParam(defaultValue = "1000") @ApiParam(value = "Demanda nacional") Integer nationalDemand,
            @RequestParam(defaultValue = "1000") @ApiParam(value = "Demanda de terceros mercados") Integer demand
    ) {
        return reportService.simulateDemand(idProductFamily, nationalDemand, demand);
    }
}
