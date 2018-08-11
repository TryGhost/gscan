(function ($) {
    function timeSince(date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);

        if (interval >= 1) {
            if (interval === 1) {
                return interval + ' year';
            } else {
                return interval + ' years';
            }
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            if (interval === 1) {
                return interval + ' month';
            } else {
                return interval + ' months';
            }
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            if (interval === 1) {
                return interval + ' day';
            } else {
                return interval + ' days';
            }
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            if (interval === 1) {
                return interval + ' hour';
            } else {
                return interval + ' hours';
            }
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            if (interval === 1) {
                return interval + ' minute';
            } else {
                return interval + ' minutes';
            }
        }
        if (Math.floor(seconds) === 1) {
            return Math.floor(seconds) + ' second';
        } else {
            return Math.floor(seconds) + ' seconds';
        }
    }
    $(document).ready(function ($) {
        if ($('#theme')[0]) {
            $('#theme-submit').prop('disabled', !$('#theme')[0].files.length);
        }

        $(document).on('change', '#theme', function () {
            $('#theme-submit').prop('disabled', !$(this)[0].files.length);
        });

        // Mobile Menu Trigger
        $('.gh-nav-burger').click(function () {
            $('.gh-mobilehead').toggleClass('gh-mobilehead-open');
        });

        // Toggle dropdown arrow
        $('#version').on('click', function () {
            $('.gh-input-icon.select-arrow').toggleClass('.active');
        });

        /** Latest News **/
        if ($('.myblogs-latest-news').length && window.ghost) {
            $.get(window.ghost.url.api('posts', {limit: 1, include: 'author'}), function (json) {
                /* eslint-disable camelcase */
                var item = json.posts[0],
                    parsed_date = new Date(item.published_at),
                    image_url = item.author.image.substr(0, 2) === '//' ? item.author.image : '//blog.ghost.org/' + item.author.image,
                    news_html = '<p><a href="https://blog.ghost.org' + item.url + '">' + item.title + '</a></p>' +
                        '<span class="meta">' +
                        '<img src="' + image_url + '" />' +
                        '<time title="' + parsed_date + '">' + timeSince(parsed_date) + ' ago</time> by ' + item.author.name + '</span>';
                $('.myblogs-latest-news').html(news_html);

                /* eslint-disable camelcase */
            });
        }

        /** Toggle Details **/
        if ($('.toggle-details').length) {
            $('.toggle-details').on('click', function () {
                if ($(this).find('~ .details').is(':hidden')) {
                    $(this).find('~ .details').show();
                    $(this).find('.show').hide();
                    $(this).find('.hide').show();
                    $(this).parent().addClass('expanded');
                } else {
                    $(this).find('~ .details').hide();
                    $(this).find('.show').show();
                    $(this).find('.hide').hide();
                    $(this).parent().removeClass('expanded');
                }
            });
        }
    });
}(jQuery));
