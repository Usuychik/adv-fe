/**
 * Created by visarev on 20.02.16.
 */

$( document ).ready( function () {
    var posts = Data.getPosts();
    var postPreviewTemplate = Handlebars.compile( $( '#post-preview-template' ).html() );
    var postsTemplate = Handlebars.compile( $( '#posts_list-template' ).html() );
    var navigationTemplate = Handlebars.compile( $( '#posts_nav-template' ).html() );
    var mainPostTemplate = Handlebars.compile($( '#main-post-template').html() );
    var commentTemplate = Handlebars.compile( $( '#comment-template').html());
    var selectedPage = 0;
    var perPage = 12;
    Handlebars.registerPartial( 'post-preview', $( '#post-preview-template' ).html() );
    //Handlebars.registerPartial( 'main-post', $( '#main-post-template').html() );
    Handlebars.registerPartial( 'comment' , $('#comment-template').html());
    Handlebars.registerHelper( "nav", function( count, selected, options ) {
        var numbers = '';
        Array.apply( null, Array( count ) )
            .forEach(
                function( v, i ) {
                    numbers += options.fn( { number: i + 1, selected: selectedPage == i } );
                }
            );
        return numbers;
    } );

    render();
    function render() {
        renderPosts();
        renderNavigation();
        subscribeHandlers();
    }

    function renderPosts() {
        $( '.posts_list' ).html( postsTemplate( {
            posts: posts.slice( selectedPage * perPage, selectedPage * perPage + perPage )
        } ) );
        console.log("renderPosts")
    }

    function renderNavigation() {
        $( '.posts_nav' ).html( navigationTemplate( {
            count: Math.ceil( posts.length / perPage ),
            selected: selectedPage
        } ) );
    }

    function renderMainPost(id){
        $( '.main-post').html(mainPostTemplate({post: Data.getPost(id), comments: Data.getPostComments(id)}))
        console.log("rendermainPosts")
    }

    function subscribeHandlers() {
        $( '.posts_nav' ).click( function( event ) {
            var selected = $( event.target ).data( 'id' ) - 1;
            if ( selected === selectedPage ) {
                return;
            }

            selectedPage = selected;

            renderPosts();
            renderNavigation();

            $( 'html, body' ).animate( { scrollTop : 0 }, 0 );
        });

        $( '.posts_list').click(function(event) {
            var id = $( event.target ).closest( '.post-preview' ).data( 'id' );
            if ( id === undefined ) {
                return;
            }
            renderMainPost(id)
            console.log( 'click: post id - ' + id );
        } );

    }
});