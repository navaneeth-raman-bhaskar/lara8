<div class="container-fluid">
    <div class="pull-left">
        <h3>{{$title}}</h3>
    </div>
    <div class="pull-right">
        <x-add-row :id="$addRowId"/>
    </div>
</div>

<div class="table-responsive">
    <table class="table" id="{{$id}}">
        {{$slot}}
    </table>
</div>
