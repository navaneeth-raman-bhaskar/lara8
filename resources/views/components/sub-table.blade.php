<div class="row">
    <div class="col-10">
        <h5>{{$title}}</h5>
    </div>
    <div class="col-2">
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
