/* le simplepage */
$(function () {
  var markdown = new Markdown.Converter();

  // replace titlebar
  $('head title').html(Settings.titlebar);
  // replace favicon
  $('head link.favicon').attr('href', Settings.favicon);
  // replace header
  $('header.title #title').html(markdown.makeHtml(Settings.title));
  $('header.title #description').html(markdown.makeHtml(Settings.description));
  // replace footer
  $('footer #footer').html(markdown.makeHtml(Settings.footer));

  // replace contents
  $.each(Settings.contents, function(index, content) {
    if (!content.ref || content.ref.trim() === "") return;

    // add to html
    var titleHtml = '<p class="title"><a href="#">'+content.title+'</a></p>';
    var contentHtml = '<div class="content" id='+index+'></div>';

    var html = 
    '<section class="section" id=' + index +'>' +
    titleHtml + contentHtml + 
    '</section>';
    
    var datasection = 'section.content div[data-section]';
    $(datasection).append(html);

    // load the file asynchronously to improve performance
    $.get(content.ref, function(data) {
      var contentsection = 'section#'+index+'.section #'+index+'.content';
      $(contentsection).html(markdown.makeHtml(data));
    });
  });
  // kickoff foundation
  $(document).foundation();
});


