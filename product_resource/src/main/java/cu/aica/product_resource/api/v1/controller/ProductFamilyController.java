package cu.aica.product_resource.api.v1.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.api.dto.ProductFamilyDTO;
import cu.aica.product_resource.api.dto.ProductFamilyDTOComparator;
import cu.aica.product_resource.models.ProductFamily;
import cu.aica.product_resource.services.ProductFamilyService;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController("v1 ProductFamily")
@RequestMapping(ApiVersion.URL_BASE_V1+"/product_family")
@Api(tags = "Familia de producto", description = "Endpoints para el CRUD de las familias de productos.")
public class ProductFamilyController {

    @Autowired
    private ProductFamilyService service;

    @GetMapping("")
    @ApiOperation(value = "Obtener todas las familias de productos paginadas", notes = "Retorna la lista paginada de familias de productos que coinciden con los parámetros introducidos.")
    public Page<ProductFamilyDTO> getAllFilter(
            @RequestParam(defaultValue = "-1", required = false) @ApiParam(value = "ID de empresa") Integer idEnterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Empresa") String enterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "UEB") String uebs,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre de la familia") String name,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Forma farmaceútica") String pharmaceuticShape,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Formato") String format,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Demanda nacional") String nationalDemand,
            @RequestParam(defaultValue = "0") @ApiParam(value = "Número de página") int page,
            @RequestParam(defaultValue = "10") @ApiParam(value = "Tamaño de página") int pageSize,
            @RequestParam(defaultValue = "id") @ApiParam(value = "Columna a ordernar", allowableValues = "id, enterprise, name, pharmaceuticShape, format, nationalDemand") String sortBy,
            @RequestParam(defaultValue = "asc") @ApiParam(value = "Ordenar ascendente (asc) o descendente (desc)", allowableValues = "asc, desc") String sort) {

        List<ProductFamilyDTO> listDTO = service.getAllFilter(idEnterprise, enterprise, uebs, name, pharmaceuticShape, format, nationalDemand);

        Pageable paging = PageRequest.of(page, pageSize, sort.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        listDTO.sort(new ProductFamilyDTOComparator(sort, sortBy));

        int totalpages = listDTO.size() / pageSize;
        int max = page >= totalpages ? listDTO.size() : pageSize*(page+1);
        int min = page > totalpages ? max : pageSize*page;

        return new PageImpl<ProductFamilyDTO>(listDTO.subList(min, max), paging, listDTO.size());

    }

    @GetMapping("/list")
    @ApiOperation(value = "Obtener listado de familias de productos")
    public List<cu.aica.product_resource.api.dto.list.ProductFamilyDTO> getAll(
            @RequestParam(defaultValue = "-1", required = false) @ApiParam(value = "ID de empresa") Integer idEnterprise
    ) {

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        return service.getAll(idEnterprise).stream().map(item -> modelMapper.map(item, cu.aica.product_resource.api.dto.list.ProductFamilyDTO.class)).collect(Collectors.toList());
    }

    @GetMapping("/list/details")
    @ApiOperation(value = "Obtener listado de familias de productos con detalles", notes = "Retorna la lista de familias de productos que coinciden con los parámetros introducidos.")
    public List<ProductFamilyDTO> getAllFilter(
            @RequestParam(defaultValue = "-1", required = false) @ApiParam(value = "ID de empresa") Integer idEnterprise,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombree") String name,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Forma farmaceútica") String pharmaceuticShape,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Formato") String format,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Demanda nacional") String nationalDemand) {

        List<ProductFamilyDTO> listDTO = service.getAllFilter(idEnterprise,"", "", name, pharmaceuticShape, format, nationalDemand);

        listDTO.sort(new ProductFamilyDTOComparator("asc", "name"));

        return listDTO;
    }

    @GetMapping("/list/dependencies")
    @ApiOperation(value = "Obtener listado de familias de productos")
    public List<ProductFamilyDTO> getAllDependencies(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "ID de familia de producto") Integer idProductFamily
    ) {
        return service.getIndirectProductFamily(idProductFamily);
    }

    @GetMapping(value = "/{id}")
    @ApiOperation(value = "Obtener familia de producto", notes = "Retorna una familia de producto dado su identificador.")
    public ProductFamilyDTO getById(@PathVariable @ApiParam(value = "Identificador de familia de producto", required = true) int id) {
        return service.getProductFamilyDTOById(id);
//        return service.getById(id);
    }

    @PostMapping(value = "")
    @ApiOperation(value = "Insertar familia de producto", notes = "Retorna la familia de producto que se ha insertada.")
    public ResponseEntity<ProductFamily> insert(@Valid @RequestBody ProductFamily entity) {
        entity = service.save(entity);

        return ResponseEntity.ok().body(entity);

    }

    @PutMapping(value = "")
    @ApiOperation(value = "Editar familia de producto", notes = "Retorna la familia de producto que se ha editada.")
    public ResponseEntity<ProductFamily> update(@Valid @RequestBody ProductFamily entity) {
        entity = service.save(entity);

        return ResponseEntity.ok().body(entity);
    }

    @DeleteMapping(value = "/{id}")
    @ApiOperation(value = "Eliminar familia de producto", notes = "Retorna \"successful\" en caso que se eliminó correctamente, \"failed\" si hubo algún error.")
    public ResponseEntity<DeleteResponse> delete(@PathVariable @ApiParam(value = "Identificador de familia de producto", required = true) int id) {
        return ResponseEntity.ok().body(service.delete(id));
    }
}
