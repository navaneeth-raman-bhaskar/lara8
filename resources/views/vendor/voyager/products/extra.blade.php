<x-subtable title="Prices" id="priceTable" addRowId="addPrice">
    <thead>
    <tr>
        <th>#</th>
        <th>Country</th>
        <th>Currency</th>
        <th>Gross Price</th>
        <th>Net Price</th>
        <th>Point value</th>
        <th></th>
    </tr>
    </thead>
    <tbody id="tBody">
    @php
        $prices=filled($dataTypeContent->prices)?$dataTypeContent->prices:[new \App\Models\Price()]
    @endphp
    @foreach($prices as $price)
        <tr>
            <td>{{$loop->iteration}}</td>
            <td>
                <x-model-id :model="$price"/>
                {{Form::select('country[]',$countries->pluck('name','id'),$price->country_id)}}
            </td>
            <td>
                {{Form::select('currency[]',$currencies->pluck('name','id'),$price->currency_id)}}
            </td>
            <td>
                {{Form::text('gross_price[]',$price->gross_price)}}
            </td>
            <td>
                {{Form::text('net_price[]',$price->net_price)}}
            </td>
            <td>
                {{Form::text('point_value[]',$price->point_value)}}
            </td>
            <td>
                <x-remove-row url="{{route('product.remove-price',['id'=>$price->id])}}" />
            </td>
        </tr>
    @endforeach
    </tbody>
</x-subtable>
