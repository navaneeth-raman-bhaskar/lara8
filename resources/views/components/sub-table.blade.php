<div class="container-fluid">
    <div class="text-center">
        <h3>{{$title}}</h3>
    </div>
    <div class="pull-right">
        <x-add-row :id="$addRowId"/>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <div class="table-responsive">
            <table class="table" id="{{$id}}">
                {{$slot}}
            </table>
        </div>
    </div>
</div>
