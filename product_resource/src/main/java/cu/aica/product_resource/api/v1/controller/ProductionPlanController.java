package cu.aica.product_resource.api.v1.controller;


import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.api.dto.ProductionPlanDTO;
import cu.aica.product_resource.api.dto.ProductionPlanDTOComparator;
import cu.aica.product_resource.models.ProductFamily;
import cu.aica.product_resource.services.ProductFamilyService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController("v1 ProductionPlan")
@RequestMapping(ApiVersion.URL_BASE_V1+"/production_plan")
@Api(tags = "Plan de producción", description = "Endpoints para el listar y editar el plan de producción de las familias de productos.")
public class ProductionPlanController {

    @Autowired
    private ProductFamilyService service;


    @GetMapping("")
    @ApiOperation(value = "Obtener todas los Planes de producción", notes = "Retorna la lista paginada de Planes de producción que coinciden con los parámetros introducidos.")
    public Page<ProductionPlanDTO> getAllPlanProduction(
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Empresa") String enterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre de la familia") String name,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Plan de este año") String planThisYear,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Plan del próximo año") String planNextYear,
            @RequestParam(defaultValue = "0") @ApiParam(value = "Número de página") int page,
            @RequestParam(defaultValue = "10") @ApiParam(value = "Tamaño de página") int pageSize,
            @RequestParam(defaultValue = "id") @ApiParam(value = "Columna a ordernar", allowableValues = "id, enterprise, name, planThisYear, planNextYear") String sortBy,
            @RequestParam(defaultValue = "asc") @ApiParam(value = "Ordenar ascendente (asc) o descendente (desc)", allowableValues = "asc, desc") String sort) {

        List<ProductionPlanDTO> listDTO = service.getAllPlanProduction(enterprise, name, planThisYear, planNextYear);

        Pageable paging = PageRequest.of(page, pageSize, sort.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        listDTO.sort(new ProductionPlanDTOComparator(sort, sortBy));

        int totalpages = listDTO.size() / pageSize;
        int max = page >= totalpages ? listDTO.size() : pageSize*(page+1);
        int min = page > totalpages ? max : pageSize*page;

        return new PageImpl<ProductionPlanDTO>(listDTO.subList(min, max), paging, listDTO.size());

    }

    @PutMapping(value = "")
    @ApiOperation(value = "Editar Plan de producción", notes = "Retorna el Plan de producción que se ha editado.")
    public ResponseEntity<ProductionPlanDTO> update(@Valid @RequestBody ProductionPlanDTO entity) {
        entity = service.updatePorductionPlan(entity);
        return ResponseEntity.ok().body(entity);
    }
}
