package cu.aica.product_resource.api.dto;

import java.util.Comparator;

public class ResourceDTOComparator implements Comparator<ResourceDTO> {

    private final String sort;
    private final String sortBy;


    public ResourceDTOComparator(String sort, String sortBy) {
        this.sort = sort;
        this.sortBy = sortBy;
    }


    public int compare(ResourceDTO re1, ResourceDTO re2) {

        if (sortBy.equals("ueb")) {

            return sort.equals("asc") ? re1.getUeb().compareTo(re2.getUeb()) : re2.getUeb().compareTo(re1.getUeb());

        } else if (sortBy.equals("storage")) {

            String ps1 = re1.getStorage() != null ? re1.getStorage() : "";
            String ps2 = re2.getStorage() != null ? re2.getStorage() : "";
            return sort.equals("asc") ? ps1.compareTo(ps2) : ps2.compareTo(ps1);

        } else if (sortBy.equals("name")) {

            String name1 = re1.getName() != null ? re1.getName() : "";
            String name2 = re2.getName() != null ? re2.getName() : "";
            return sort.equals("asc") ? name1.compareTo(name2) : name2.compareTo(name1);

        } else if (sortBy.equals("codigo")) {

            String cup1 = re1.getCodigo() != null ? re1.getCodigo() : "";
            String cup2 = re2.getCodigo() != null ? re2.getCodigo() : "";
            return sort.equals("asc") ? cup1.compareTo(cup2) : cup2.compareTo(cup1);

        } else if (sortBy.equals("mistralCount")) {

            String ps1 = re1.getMistralCount() != null ? re1.getMistralCount() : "";
            String ps2 = re2.getMistralCount() != null ? re2.getMistralCount() : "";
            return sort.equals("asc") ? ps1.compareTo(ps2) : ps2.compareTo(ps1);

        } else
            return sort.equals("asc") ? Integer.compare(re1.getId(), re2.getId()) : Integer.compare(re2.getId(), re1.getId());
    }
}
