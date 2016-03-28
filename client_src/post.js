/**
 * Created by visarev on 28.03.16.
 */
$( document ).ready( function () {
    var posts = Data.getRelatedPosts();

    var postPreviewTemplate = Handlebars.compile( $( '#post-preview-template' ).html() );
    var relatedPostsTemplate = Handlebars.compile( $( '#posts-container-related_list-template' ).html() );
    var currentPostTemplate = Handlebars.compile($( '#posts-container-current_post-template').html() );
    Handlebars.registerPartial( 'post-preview', $( '#post-preview-template' ).html() );
    Handlebars.registerPartial( 'comment' , $('#posts-container-current_post-comment-template').html());

    render();

    function render() {
        renderRelatedPosts();
        renderCurrentPost();
        subscribeHandlers();
    }

    function renderRelatedPosts() {
        $( '.posts-container-related_list' ).html( relatedPostsTemplate ( {
            posts: posts
        } ) );
    }

    function renderCurrentPost(){
        var post = Data.getCurrentPost()
        $( '.posts-container-current_post').html(currentPostTemplate({post: post , comments: Data.getPostComments(post.id)}))
        console.log("renderCurrentPost")
    }

    function subscribeHandlers() {
        $( '.posts-container-related_list' ).click( function ( event ) {
            var id = $( event.target ).closest( '.post-preview' ).data( 'id' );
            if ( id === undefined ) {
                return;
            }
            console.log( 'click: post id - ' + id );
            window.location.href = "post.html?id="+id;
        } );

    }
});