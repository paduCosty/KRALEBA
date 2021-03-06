<?php

namespace App\Helpers;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\Products;
use Illuminate\Http\Request;


class CustomerHelper extends Controller
{
    public $product;
    public $customers;

    public function __construct()
    {
        $this->product = new Products();
        $this->customers = new Customers();
    }

    public function helper_get_categories_to_customers($customers)
    {


        foreach ($customers as $customer) {

            if (is_object($customer)) {
                $customer = (array)$customer;
            }

            if ($customer['category_id'] && is_numeric($customer['category_id'])) {
                $category = $this->product->get_customer_category_by_id($customer['category_id']);
                $customer['category_id'] = $category;

            }

            if ($customer['subcategory_id'] && is_numeric($customer['subcategory_id'])) {
                $subcategory = $this->product->get_customer_subcategory_by_id($customer['subcategory_id']);
                $customer['subcategory_id'] = $subcategory;
            }
        }
        return $customers;
    }

    public function helper_add_subcategory(Request $request)
    {
        if (!is_numeric($request->input('category_id'))) {
            return false;
        }
        $category_id = $request->input('category_id');
        $subcategory = $request->input('subcategory_label');

        $ifSubcategoryExist = (array)$this->product->find_subcategory_by_label($subcategory);

        if (!$ifSubcategoryExist) {
            $this->product->set_customers_subcategory(array('name' => $subcategory, 'category_id' => $category_id));
            $subcategory = (array)$this->product->find_subcategory_by_label($subcategory);

        } else {
            return false;
        }

        return $subcategory;

    }

//generate title afrer filter
    public function helper_generate_title_after_filter($customer_type, $category, $subcategory_id)
    {
//        dd($customer_type);
        if ($customer_type == 'Provider') {
            $customer_type = "Furnizor";
        }
        if ($customer_type == 'Customer') {
            $customer_type = 'Beneficiar';
        }

        $title_text = " ";

        if ($customer_type) {
            $title_text .= ' ' . $customer_type;
        }
        if ($category) {
            $title_text .= ' / ' . $this->product->get_customer_category_by_id($category)->name;
        }
        if (!is_numeric($subcategory_id) && $subcategory_id) {
            $subcategory_id = $this->product->find_subcategory_by_label($subcategory_id)->subcategory_id;
        }
//
        if ($subcategory_id && is_numeric($subcategory_id)) {
            $title_text .= ' / ' . $this->product->get_customer_subcategory_by_id($subcategory_id)->name;
        }

        return $title_text;
    }

    public function helper_show_filter($data)
    {

        $customer_type = $data['customer_type'] ?? '';
        $category = $data['category'] ?? '';
        $subcategory = $data['subcategory'] ?? '';

        $subcategory = $this->product->find_subcategory_by_label($subcategory) ?? '';

        $subcategory_id = $subcategory->subcategory_id ?? '';
        // dump($subcategory_id);

        return array(
            'customers' => $this->customers->get_customers_after_filter($customer_type, $category, $subcategory_id),
            'filter_title' => $this->helper_generate_title_after_filter($customer_type, $category, $subcategory_id),
            'type' => $customer_type,
            'category' => $category,
            'subcategory' => $subcategory_id
        );
    }


    public function show_subcategory_by_category_id(Request $request)
    {
        return $this->product->get_subcategory_by_category_id($request->input('category_id'));

    }

//    show customer coin
    public function show_coin_by_country($country_id)
    {
        $coin = array();
        if ($country_id == 1) {
            $coin['label'] = "LEI";
            $coin['id'] = $country_id;
        } else {
            $coin['label'] = "EURO";
            $coin['id'] = $country_id;

        }
        return $coin;
    }

    public function bills_value_calculated_ware($bills)
    {
        if(!$bills) {
            return  false;
        }
        $j = 0;
        $bills_array = array();
        foreach ($bills as $bill) {
            $i = 0;
            foreach ($bill as $ware) {
                $ware = (array)$ware;


                if ($ware['coin'] == 1) {
                    $exchange = round($ware['price'] / $ware['exchange'], 3);
                    $ware['price_euro'] = $exchange;
                    $ware['price_lei'] = $ware['price'];


                    $ware['tva_lei_buc'] = round(($ware['price'] / 100) * $ware['TVA'], 3);
                    $ware['tva_euro_buc'] = round(($exchange / 100) * $ware['TVA'], 3);
                } else {
//                    dd($ware['price']);

                    $ware['tva_euro_buc'] = round(($ware['price'] / 100) * $ware['TVA'], 3);
                    $exchange = round($ware['price'] * $ware['exchange'], 3);
                    $ware['price_euro'] = $ware['price'];
                    $ware['price_lei'] = $exchange;
                    $ware['tva_lei_buc'] = round(($exchange / 100) * $ware['TVA'], 3);

                }

                $bills_array[$j][$i] = $ware;
                $i++;

            }
            $j++;
        }
//        dd($bills_array);

        return $bills_array;
    }

}










