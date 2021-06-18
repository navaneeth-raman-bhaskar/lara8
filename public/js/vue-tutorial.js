const root = {
    data() {
        return {
            products: $('#productList').data('products'),
            cart: [],
        }
    },
    methods: {
        addProduct(item) {
            this.cart.push(item.id)
        },
        removeProduct(item) {
            let toRemove = this.cart.findIndex(p => p === item.id);
            this.cart.splice(toRemove, 1);
        },
        showProduct(item) {
            let myModal = new bootstrap.Modal(document.getElementById('productModal'));
            myModal.show();
        }
    }
}

const productComponent = {
    data() {
        return {
            temp: 0,
        }
    },
    methods: {
        addToCart(product) {
            this.temp++
            this.$emit('addedCart', product)

        },
        removeFromCart(product) {
            this.temp--
            this.$emit('removedCart', product)
        },

    },
    computed: {
        outOfStock() {
            return this.product.stock_left === 0
        },
        inStock() {
            return this.product.stock_left - this.temp
        },
        canAdd() {
            return this.product.stock_left > 0 && this.inStock > 0
        },
        canMinus() {
            return this.temp > 0
        }
    },
    //props: ['product'],
    props: {
        product: {
            type: Object,
            required: true
        },
    },
    emits: ['addedCart', 'removedCart'],
    //emits: ['addedCart', 'removedCart'],
    template: `
<div class="card col mx-4" style="width: 18rem;" :class="{'border-danger':outOfStock}">
    <div class="card-header">
        Stock Left: <strong>{{inStock}}</strong>
    </div>
    <img :src="product.image" class="card-img-top" alt="image">
    <div class="card-body">
        <h5 class="card-title">{{product.name}}</h5>
        <p class="card-text">{{product.slug}}</p>
        <button type="button" class="card-link btn btn-success" v-show="canAdd" v-on:click="addToCart(product)"><slot name="plus">+</slot></button>
        <button type="button" class="card-link btn btn-danger" v-show="canMinus" @click="removeFromCart(product)"><slot name="minus">-</slot></button>
    </div>
</div>`
};


const app = Vue.createApp(root)

app.component('product-card', productComponent)

app.mount('#productList')
