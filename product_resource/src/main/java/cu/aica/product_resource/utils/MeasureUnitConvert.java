package cu.aica.product_resource.utils;

public class MeasureUnitConvert {


    public static Double convert(Double value, String from, String to) {
        if (from.equals(to)) {
            return value;
        } else if (from.equals("MG")) {
            switch (to) {
                case "G":
                    return value / 1000;
                case "KG":
                    return value / 1000000;
                case "T":
                    return value / 1000000;
            }
        } else if (from.equals("G")) {
            switch (to) {
                case "MG":
                    return value * 1000;
                case "KG":
                    return value / 1000;
                case "T":
                    return value / 1000;
            }
        } else if (from.equals("KG") || from.equals("T")) {
            switch (to) {
                case "MG":
                    return value * 1000000;
                case "G":
                    return value * 1000;
                case "KG":
                    return value;
                case "T":
                    return value;
            }
        } else if (from.equals("U")) {
            switch (to) {
                case "MU":
                    return value / 1000;
                case "M":
                    return value / 1000;
                case "ROL":
                    return value / 1000;
            }
        }else if (from.equals("MU") || from.equals("M") || from.equals("ROL")) {
            switch (to) {
                case "U":
                    return value * 1000;
                case "MU":
                    return value;
                case "M":
                    return value;
                case "ROL":
                    return value;
            }
        } else if (from.equals("L") || from.equals("LTS")) {
            switch (to) {
                case "L":
                    return value;
                case "LTS":
                    return value;
            }
        }

        return value;

    }
}
