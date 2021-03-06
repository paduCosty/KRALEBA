<?php

namespace App\Models;

use Dflydev\DotAccessData\Data;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Bills extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id', 'unique_code', 'type', 'bill_date', 'bill_number', 'currency', 'exchange', 'TVA', 'item',
        'specify_id',
    ];

    public function create_bill_and_update_ware($data)
    {
        $bill = Bills::create($data);

        foreach ($data['wares_id'] as $wares) {
            DB::select("UPDATE customer_wares
                SET status = 1, bill_id = " . $bill->id . "
                WHERE id = {$wares}");

        }

    }

    public function get_customer_bill_by_id($customer_id, $bill_id = false)
    {
        if (!$customer_id || !is_numeric($customer_id)) {
            return false;
        }
        $bills = DB::table('bills')->where('id', $bill_id)->get();
        $i = 0;
        $generatedBills = array();
        foreach ($bills as $bill) {
            $generatedBills[$i] = DB::select("SELECT *
            FROM customer_wares
            LEFT JOIN bills
            ON bills.id = customer_wares.bill_id
            WHERE bills.customer_id = {$customer_id}
            AND customer_wares.bill_id = {$bill->id}");
            $i++;
        }
        if ($generatedBills) {
            return $generatedBills;
        } else {
            return false;
        }
    }


    public function get_bill_by_id($bill_id)
    {
        if (is_numeric($bill_id)) {
            return DB::table('bills')->where('id', $bill_id)->first();
        }
        return false;
    }

    public function delete_bill_and_wares($bill_id)
    {

        DB::table('bills')->where('id', $bill_id)->delete();
        DB::table('customer_wares')->where('bill_id', $bill_id)->delete();

    }

    public function get_bills_by_filter($customer_type = false, $type = false, $start_date = false, $end_date = false)
    {
        $query_format = '';

        if (!$end_date) {
            $end_date = date('Y-m-d');
        }

        $start_date = date("d/m/Y", strtotime($start_date));
        $end_date = date("d/m/Y", strtotime($end_date));

        if ($customer_type) {
            $query_format .= " WHERE customers.type = '{$customer_type}'";
        }

        if ($type && $query_format) {
            $query_format .= " AND bills.type = {$type}";
        } else if ($type) {
            $query_format .= " WHERE bills.type = {$type}";
        }

        if ($start_date && $query_format) {
            $query_format .= " AND bills.bill_date BETWEEN '{$start_date}' AND '{$end_date}'  ORDER BY bills.bill_date ASC ";
        } else if ($start_date) {
            $query_format .= " WHERE bills.bill_date BETWEEN '{$start_date}' AND '{$end_date}' ORDER BY bills.bill_date ASC ";
        }

        $query = "SELECT bills.id, bills.customer_id, customers.name, bills.bill_date, bills.bill_number, bills.exchange, bills.TVA
                FROM bills
                JOIN customers
                ON bills.customer_id = customers.id" . $query_format ?? '';

        return DB::select($query);
    }

}
