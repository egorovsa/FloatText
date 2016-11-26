# floatText
jQuery Plugin for floating text in blocks

 * Example:

```css
.floatText{
  width:200px;
  height: 295px;
  overflow:hidden;
  float:left;
  border:1px solid black;
  margin:10px;
}
```

```html
<!-- HTML -->
<div class="classForInit familyName">Put text here</div>
<div class="familyName"></div>
<div class="familyName"></div>
<div class="familyName"></div>
<div class="familyName"></div>
```

```js
//Javascript
$(function(){
    $('.classForInit').floatText({
        familyClassName: '.familyName'
    });
});
```

See the demo
http://codepen.io/anon/pen/rxLeRz
