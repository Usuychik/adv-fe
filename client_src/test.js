/**
 * Created by visarev on 06.03.16.
 */
$( document ).ready( function () {
    var posts = Data.getPosts();
    var jsonTemplate = Handlebars.compile( $( '#posts-json-template' ).html() );
    var tableTemplate = Handlebars.compile( $( '#posts-table-template' ).html() )
    Handlebars.registerHelper( "json", function(posts){
        return JSON.stringify(posts, null, 2)
    } );
    Handlebars.registerHelper("table", function(context,options){
        var ret = "";
        for (var i=0, j=context.length; i<j; i++) {
            if (i%2 == 0){
                ret = ret + '<div class="first_row">' + options.fn(context[i]) + '</div>';
            } else{
                ret = ret + '<div class="second_row">' + options.fn(context[i]) + '</div>';
            }
        }
        return ret;
    });
    render();
    function render(){
        renderJson();
        renderTable();
    }
    function renderJson(){
        $( '.posts-json' ).html(jsonTemplate({posts:posts.slice(0,5)}));
    }

    function renderTable(){
        $( '.posts-table' ).html(tableTemplate({posts:posts.slice(0,5)}));
    }

});