package cu.aica.product_resource.api.v1.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.api.dto.ResourceDTO;
import cu.aica.product_resource.api.dto.ResourceDTOComparator;
import cu.aica.product_resource.services.ResourceService;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("v1 Resource")
@RequestMapping(ApiVersion.URL_BASE_V1+"/resource")
@Api(tags = "Recursos", description = "Endpoints para el CRUD de recursos.")
public class ResourceController {

    @Autowired
    private ResourceService service;

    @GetMapping("")
    @ApiOperation(value = "Obtener todos los recursos paginados", notes = "Retorna la lista paginada de recursos que coinciden con los parámetros introducidos.")
    public Page<ResourceDTO> getAllFilter(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "ID de familia de recurso", required = true) Integer idResourceFamily,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "UEB") String ueb,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Almacén de Mistral") String storage,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre del recurso") String name,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Código del recurso") String codigo,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Existencia en mistral") String mistralCount,
            @RequestParam(defaultValue = "0") @ApiParam(value = "Número de página") int page,
            @RequestParam(defaultValue = "10") @ApiParam(value = "Tamaño de página") int pageSize,
            @RequestParam(defaultValue = "id") @ApiParam(value = "Columna a ordernar", allowableValues = "id, ueb, storage, name, codigo, mistralCount, measureUnit") String sortBy,
            @RequestParam(defaultValue = "asc") @ApiParam(value = "Ordenar ascendente (asc) o descendente (desc)", allowableValues = "asc, desc") String sort) {

        Pageable paging = PageRequest.of(page, pageSize, sort.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        List<ResourceDTO> listDTO = service.getAllFilter(idResourceFamily, ueb, storage, name, codigo, mistralCount);

        listDTO.sort(new ResourceDTOComparator(sort, sortBy));

        int totalpages = listDTO.size() / pageSize;
        int max = page >= totalpages ? listDTO.size() : pageSize * (page + 1);
        int min = page > totalpages ? max : pageSize * page;

        return new PageImpl<ResourceDTO>(listDTO.subList(min, max), paging, listDTO.size());

    }

    @GetMapping("/list")
    @ApiOperation(value = "Obtener listado de recursos", notes = "Retorna la lista de recursos que coinciden con los parámetros introducidos.")
    public List<ResourceDTO> getAllFilter(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "ID de familia de recurso", required = true) Integer idResourceFamily,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "UEB") String ueb,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Almacén de Mistral") String storage,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre del recurso") String name,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Código del recurso") String codigo,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Existencia en mistral") String mistralCount) {

        List<ResourceDTO> listDTO = service.getAllFilter(idResourceFamily, ueb, storage, name, codigo, mistralCount);

        listDTO.sort(new ResourceDTOComparator("asc", "name"));

        return listDTO;
    }

    @DeleteMapping(value = "/{id}")
    @ApiOperation(value = "Eliminar recurso", notes = "Retorna \"successful\" en caso que se eliminó correctamente, \"restricted\" si hay alguna restricción, \"failed\" si hubo algún error.")
    public ResponseEntity<DeleteResponse> delete(@PathVariable @ApiParam(value = "Identificador de recurso", required = true) int id) {
        return ResponseEntity.ok().body(service.delete(id));
    }
}
