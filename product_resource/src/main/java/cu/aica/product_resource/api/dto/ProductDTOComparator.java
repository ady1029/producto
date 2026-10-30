package cu.aica.product_resource.api.dto;

import java.util.Comparator;

public class ProductDTOComparator implements Comparator<ProductDTO> {

    private final String sort;
    private final String sortBy;


    public ProductDTOComparator(String sort, String sortBy) {
        this.sort = sort;
        this.sortBy = sortBy;
    }


    public int compare(ProductDTO pf1, ProductDTO pf2) {

        if (sortBy.equals("ueb")) {

            return sort.equals("asc") ? pf1.getUeb().compareTo(pf2.getUeb()) : pf2.getUeb().compareTo(pf1.getUeb());

        } else if (sortBy.equals("name")) {

            String name1 = pf1.getName() != null ? pf1.getName() : "";
            String name2 = pf2.getName() != null ? pf2.getName() : "";
            return sort.equals("asc") ? name1.compareTo(name2) : name2.compareTo(name1);

        } else if (sortBy.equals("cup")) {

            String cup1 = pf1.getCup() != null ? pf1.getCup() : "";
            String cup2 = pf2.getCup() != null ? pf2.getCup() : "";
            return sort.equals("asc") ? cup1.compareTo(cup2) : cup2.compareTo(cup1);

        } else if (sortBy.equals("pharmaceuticShape")) {

            String ps1 = pf1.getPharmaceuticShape() != null ? pf1.getPharmaceuticShape() : "";
            String ps2 = pf2.getPharmaceuticShape() != null ? pf2.getPharmaceuticShape() : "";
            return sort.equals("asc") ? ps1.compareTo(ps2) : ps2.compareTo(ps1);

        }
        else if (sortBy.equals("market")) {

            String market1 = pf1.getMarket() != null ? pf1.getMarket() : "";
            String market2 = pf2.getMarket() != null ? pf2.getMarket() : "";
            return sort.equals("asc") ? market1.compareTo(market2) : market2.compareTo(market1);

        }
        else if (sortBy.equals("codigo")) {

            String codigo1 = pf1.getCodigo() != null ? pf1.getCodigo() : "";
            String codigo2 = pf2.getCodigo() != null ? pf2.getCodigo() : "";
            return sort.equals("asc") ? codigo1.compareTo(codigo2) : codigo2.compareTo(codigo1);

        }
        else
            return sort.equals("asc") ? Integer.compare(pf1.getId(), pf2.getId()) : Integer.compare(pf2.getId(), pf1.getId());
    }
}
