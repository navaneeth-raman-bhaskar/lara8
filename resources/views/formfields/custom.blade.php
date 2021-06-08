<input type="{{$options->custom_type??'text'}}"
       class="form-control"
       name="{{ $row->field }}"
       data-name="{{ $row->display_name }}"
       @if(isset($options->disabled)) disabled @endif
       @if(isset($options->readonly)) readonly @endif
       @if($row->required == 1) required @endif
       placeholder="{{ isset($options->placeholder)? old($row->field, $options->placeholder): $row->display_name }}"
       value="@if(isset($dataTypeContent->{$row->field})){{ old($row->field, $dataTypeContent->{$row->field}) }}@else{{old($row->field)}}@endif">
