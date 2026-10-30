package cu.aica.product_resource.api.v1.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.api.dto.ResourceFamilyDTO;
import cu.aica.product_resource.api.dto.ResourceFamilyDTOComparator;
import cu.aica.product_resource.models.ResourceFamily;
import cu.aica.product_resource.services.ResourceFamilyService;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController("v1 ResourceFamily")
@RequestMapping(ApiVersion.URL_BASE_V1+"/resource_family")
@Api(tags = "Familia de recursos", description = "Endpoints para el CRUD de las familias de recursos.")
public class ResourceFamilyController {


    @Autowired
    private ResourceFamilyService service;


    @GetMapping("")
    @ApiOperation(value = "Obtener todas las familias de recursos paginadas", notes = "Retorna la lista paginada de familias de recursos que coinciden con los parámetros introducidos.")
    public Page<ResourceFamilyDTO> getAllFilter(
            @RequestParam(defaultValue = "-1", required = false) @ApiParam(value = "ID de empresa") Integer idEnterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Empresa") String enterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre de la familia") String name,
            @RequestParam(defaultValue = "0") @ApiParam(value = "Número de página") int page,
            @RequestParam(defaultValue = "10") @ApiParam(value = "Tamaño de página") int pageSize,
            @RequestParam(defaultValue = "id") @ApiParam(value = "Columna a ordernar", allowableValues = "id, enterprise, name") String sortBy,
            @RequestParam(defaultValue = "asc") @ApiParam(value = "Ordenar ascendente (asc) o descendente (desc)", allowableValues = "asc, desc") String sort) {


        List<ResourceFamilyDTO> listDTO = service.getAllFilter(idEnterprise, enterprise, name);

        Pageable paging = PageRequest.of(page, pageSize, sort.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        listDTO.sort(new ResourceFamilyDTOComparator(sort, sortBy));

        int totalpages = listDTO.size() / pageSize;
        int max = page >= totalpages ? listDTO.size() : pageSize*(page+1);
        int min = page > totalpages ? max : pageSize*page;

        return new PageImpl<ResourceFamilyDTO>(listDTO.subList(min, max), paging, listDTO.size());

    }

    @GetMapping("/list")
    @ApiOperation(value = "Obtener listado de familias de recursos", notes = "Retorna la lista paginada de familias de recursos que coinciden con los parámetros introducidos.")
    public List<ResourceFamilyDTO> getAllFilter(
            @RequestParam(defaultValue = "-1", required = false) @ApiParam(value = "ID de empresa") Integer idEnterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Empresa") String enterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre de la familia") String name,
            @RequestParam(defaultValue = "-1", required = false) @ApiParam(value = "ID de empresa") Integer idProductFamily,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Criterio de la relación") String relationCriteria,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Tipo de recurso") String resourceType
            ) {
        List<ResourceFamilyDTO> listDTO = service.getAllFilter(idEnterprise, enterprise, name, idProductFamily, relationCriteria, resourceType);

        listDTO.sort(new ResourceFamilyDTOComparator("asc", "name"));

        return listDTO;

    }

    @GetMapping(value = "/{id}")
    @ApiOperation(value = "Obtener familia de recurso", notes = "Retorna una familia de recurso dado su identificador.")
    public ResourceFamily getById(@PathVariable @ApiParam(value = "Identificador de familia de recurso", required = true) int id) {
        return service.getById(id);
    }

    @PostMapping(value = "")
    @ApiOperation(value = "Insertar familia de recurso", notes = "Retorna la familia de recurso que se ha insertada.")
    public ResponseEntity<ResourceFamily> insert(@Valid @RequestBody ResourceFamily entity) {
        entity = service.save(entity);

        return ResponseEntity.ok().body(entity);

    }

    @PutMapping(value = "")
    @ApiOperation(value = "Editar familia de recurso", notes = "Retorna la familia de recurso que se ha editada.")
    public ResponseEntity<ResourceFamily> update(@Valid @RequestBody ResourceFamily entity) {
        entity = service.save(entity);

        return ResponseEntity.ok().body(entity);
    }

    @DeleteMapping(value = "/{id}")
    @ApiOperation(value = "Eliminar familia de recurso", notes = "Retorna \"successful\" en caso que se eliminó correctamente, \"failed\" si hubo algún error.")
    public ResponseEntity<DeleteResponse> delete(@PathVariable @ApiParam(value = "Identificador de familia de recurso", required = true) int id) {
        return ResponseEntity.ok().body(service.delete(id));
    }
}
