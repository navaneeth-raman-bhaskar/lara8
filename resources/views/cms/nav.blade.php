<ul>
    @foreach($items as $menu_item)
        <li><a href="{{ $menu_item->link() }}">{{ $menu_item->title }}</a></li>
        @if(filled($menu_item->children))
            @foreach($menu_item->children as $item)
            <ul>
                <li><a href="{{ $item->link() }}">{{ $item->title }}</a></li>
            </ul>
            @endforeach
        @endif
    @endforeach
</ul>
