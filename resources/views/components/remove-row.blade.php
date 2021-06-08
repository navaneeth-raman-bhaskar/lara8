@unless($hide)
    <button data-url="{{$url}}" type="button"
            class="removeRow btn btn-sm btn-danger" {{$disabled}}>
        <i class="voyager-trash"></i>
    </button>
@endunless
