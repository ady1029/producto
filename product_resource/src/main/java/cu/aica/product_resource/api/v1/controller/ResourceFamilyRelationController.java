package cu.aica.product_resource.api.v1.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.api.dto.ResourceFamilyRelationDTO;
import cu.aica.product_resource.api.dto.ResourceFamilyRelationDTOComparator;
import cu.aica.product_resource.models.ResourceFamilyRelation;
import cu.aica.product_resource.services.ResourceFamilyRelationService;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("v1 ResourceFamilyRelation")
@RequestMapping(ApiVersion.URL_BASE_V1+"/resource_family_relation")
@Api(tags = "Familias de recuros asociadas a relación", description = "Endpoints para el CRUD de las familias de recuros asociadas a relación.")
public class ResourceFamilyRelationController {


    @Autowired
    private ResourceFamilyRelationService service;

    @GetMapping("")
    @ApiOperation(value = "Obtener dado una realción todas de familias de recuros paginadas", notes = "Retorna la lista paginada de familias de recuros que coinciden con los parámetros introducidos.")
    public Page<ResourceFamilyRelationDTO> getAllFilter(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "ID de la relación") Integer idRelation,
//            @RequestParam(defaultValue = "-1", required = false) @ApiParam(value = "ID de la familia de producto") Integer idResourceFamily,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Empresa de la familia de producto") String enterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre de la familia de producto") String name,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Tipo de recurso") String resourceType,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Volumen de presentación") String referenceCount,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Unidad de medida") String measureUnit,
            @RequestParam(defaultValue = "0") @ApiParam(value = "Número de página") int page,
            @RequestParam(defaultValue = "10") @ApiParam(value = "Tamaño de página") int pageSize,
            @RequestParam(defaultValue = "id") @ApiParam(value = "Columna a ordernar", allowableValues = "idResourceFamily, enterprise, name, resourceType, referenceCount, measureUnit") String sortBy,
            @RequestParam(defaultValue = "asc") @ApiParam(value = "Ordenar ascendente (asc) o descendente (desc)", allowableValues = "asc, desc") String sort
    ){

        List<ResourceFamilyRelationDTO> listDTO = service.getAllFilter(idRelation, enterprise, name, resourceType, referenceCount, measureUnit);

        Pageable paging = PageRequest.of(page, pageSize, sort.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        listDTO.sort(new ResourceFamilyRelationDTOComparator(sort, sortBy));

        int totalpages = listDTO.size() / pageSize;
        int max = page >= totalpages ? listDTO.size() : pageSize * (page + 1);
        int min = page > totalpages ? max : pageSize * page;

        return new PageImpl<ResourceFamilyRelationDTO>(listDTO.subList(min, max), paging, listDTO.size());
    }

    @GetMapping("/list")
    @ApiOperation(value = "Obtener listado de las familias de recuros asociados a la relación", notes = "Retorna la lista de familias de recuros asociadas a la relación que coinciden con los parámetros introducidos.")
    public List<ResourceFamilyRelationDTO> getAllFilter(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "ID de la relación") Integer idRelation,
//            @RequestParam(defaultValue = "-1", required = false) @ApiParam(value = "ID de la familia de producto") Integer idResourceFamily,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Empresa de la familia de producto") String enterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre de la familia de producto") String name,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Tipo de recurso") String resourceType,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Volumen de presentación") String referenceCount,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Unidad de medida") String measureUnit
            ){

        return service.getAllFilter(idRelation, enterprise, name, resourceType, referenceCount, measureUnit);
    }

    @PutMapping(value = "")
    @ApiOperation(value = "Editar familia de recurso asociada a la relación", notes = "Retorna la familia de recurso asociada a la relación que se ha editada.")
    public ResponseEntity<ResourceFamilyRelation> update(@RequestBody ResourceFamilyRelation entity) {
        entity = service.save(entity);

        return ResponseEntity.ok().body(entity);
    }

    @DeleteMapping(value = "/{id}")
    @ApiOperation(value = "Eliminar familia de recurso asociada a la relación", notes = "Retorna \"successful\" en caso que se eliminó correctamente, \"restricted\" si hay alguna restricción y \"failed\" si hubo algún error.")
    public ResponseEntity<DeleteResponse> delete(@PathVariable @ApiParam(value = "Identificador de la asociación entre la familia de recurso y la relación", required = true) int id) {
        return ResponseEntity.ok().body(service.delete(id));
    }

}
