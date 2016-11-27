# FloatText v 1.2.0
jQuery Plugin for spliting big text to several blocks

- v1.2.0 Append hyphen support. 

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
