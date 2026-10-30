package cu.aica.product_resource.api.v1.controller;

import cu.aica.product_resource.api.ApiVersion;
import cu.aica.product_resource.api.dto.ProductDTO;
import cu.aica.product_resource.api.dto.ProductDTOComparator;
import cu.aica.product_resource.models.Product;
import cu.aica.product_resource.services.ProductService;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("v1 Product")
@RequestMapping(ApiVersion.URL_BASE_V1+"/product")
@Api(tags = "Producto", description = "Endpoints para el CRUD de productos.")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping("")
    @ApiOperation(value = "Obtener todos los productos paginados", notes = "Retorna la lista paginada de productos que coinciden con los parámetros introducidos.")
    public Page<ProductDTO> getAllFilter(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "ID de familia de producto", required = true) Integer idProductFamily,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "UEB") String ueb,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre de producto") String name,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "CUP") String cup,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Forma famacéutica") String pharmaceuticShape,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Mercado") String market,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Código inicial del lote") String codigo,
            @RequestParam(defaultValue = "0") @ApiParam(value = "Número de página") int page,
            @RequestParam(defaultValue = "10") @ApiParam(value = "Tamaño de página") int pageSize,
            @RequestParam(defaultValue = "id") @ApiParam(value = "Columna a ordernar", allowableValues = "id, ueb, name, cup, pharmaceuticShape, market, presentationVolume, measureUnit") String sortBy,
            @RequestParam(defaultValue = "asc") @ApiParam(value = "Ordenar ascendente (asc) o descendente (desc)", allowableValues = "asc, desc") String sort) {

        Pageable paging = PageRequest.of(page, pageSize, sort.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        List<ProductDTO> listDTO = service.getAllFilter(idProductFamily, ueb, name, cup, pharmaceuticShape, market, codigo);

        listDTO.sort(new ProductDTOComparator(sort, sortBy));

        int totalpages = listDTO.size() / pageSize;
        int max = page >= totalpages ? listDTO.size() : pageSize * (page + 1);
        int min = page > totalpages ? max : pageSize * page;

        return new PageImpl<ProductDTO>(listDTO.subList(min, max), paging, listDTO.size());
    }

    @GetMapping("/list")
    @ApiOperation(value = "Obtener listado de productos", notes = "Retorna la lista de productos que coinciden con los parámetros introducidos.")
    public List<ProductDTO> getAllFilter(
            @RequestParam(defaultValue = "-1") @ApiParam(value = "ID de familia de producto") Integer idProductFamily,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "UEB") String ueb,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Nombre de producto") String name,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "CUP") String cup,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Forma famacéutica") String pharmaceuticShape,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Mercado") String market,
            @RequestParam(defaultValue = "", required = false) @ApiParam(value = "Código inicial del lote") String codigo) {

        List<ProductDTO> listDTO = service.getAllFilter(idProductFamily, ueb, name, cup, pharmaceuticShape, market, codigo);

        listDTO.sort(new ProductDTOComparator("asc", "name"));

        return listDTO;
    }

    @PutMapping(value = "")
    @ApiOperation(value = "Editar producto", notes = "Actuliza el volumen de presentación y la unidad de medida del producto.")
    public Product update(@RequestBody Product entity) {
        return service.save(entity);
    }

    @DeleteMapping(value = "/{id}")
    @ApiOperation(value = "Eliminar producto", notes = "Retorna \"successful\" en caso que se eliminó correctamente, \"restricted\" si hay alguna restricción, \"failed\" si hubo algún error.")
    public ResponseEntity<DeleteResponse> delete(@PathVariable @ApiParam(value = "Identificador de producto", required = true) int id) {
        return ResponseEntity.ok().body(service.delete(id));
    }
}
