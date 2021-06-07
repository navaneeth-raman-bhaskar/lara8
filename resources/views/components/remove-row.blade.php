@unless($hide)
    <button data-url="{{$url}}" type="button"
            class="removeRow btn btn-sm btn-outline-danger" {{$disabled}}>
        <i class="fa fa-minus">REMOVE</i>
    </button>
@endunless
