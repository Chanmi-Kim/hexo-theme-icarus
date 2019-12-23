'use strict';

const moment = require('moment');
const { Component, Fragment } = require('inferno');
const Paginator = require('./misc/paginator');

module.exports = class extends Component {
    render() {
        const { page } = this.props;
        // TODO
        const helper = {};
        const config = {};
        const { url_for, __, has_thumbnail, get_thumbnail, date_xml, date } = helper;

        const language = page.lang || page.language || config.language;

        function renderArticleList(posts, year, month = null) {
            const time = moment([page.year, page.month ? page.month - 1 : null].filter(i => i !== null));

            return <div className="card widget">
                <div className="card-content">
                    <h3 className="tag is-link">{month === null ? year : time.locale(language).format('MMMM YYYY')}</h3>
                    <div className="timeline">
                        {posts.map(post => {
                            const categories = [];
                            post.categories.forEach((category, i) => {
                                categories.push(<a className="has-link-grey" href={category.url}>{category.name}</a>);
                                if (i < post.categories.length - 1) {
                                    categories.push('/');
                                }
                            });
                            return <article className="media">
                                {has_thumbnail(post) ? <a href={url_for((post.link || post.path))} className="media-left">
                                    <p className="image is-64x64">
                                        <img className="thumbnail" src={get_thumbnail(post)} alt={post.title || get_thumbnail(post)} />
                                    </p>
                                </a> : null}
                                <div className="media-content">
                                    <div className="content">
                                        <time className="has-text-grey is-size-7 is-block is-uppercase"
                                            datetime={date_xml(post.date)}>{date(post.date)}</time>
                                        <a className="title has-link-black-ter is-size-6 has-text-weight-normal"
                                            href={url_for((post.link || post.path))} >{post.title}</a>
                                        <div className="level article-meta is-mobile">
                                            <div className="level-left">
                                                {categories.length ? <div className="level-item is-size-7 is-uppercase">
                                                    {categories}
                                                </div> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        })}
                    </div>
                </div>
            </div>;
        }

        let articleList;
        if (!page.year) {
            const years = {};
            page.posts.each(p => years[p.date.year()] = null);
            articleList = Object.keys(years).sort((a, b) => b - a).map(year => {
                let posts = page.posts.filter(p => p.date.year() == year);
                return renderArticleList(posts, year, null);
            });
        } else {
            articleList = renderArticleList(page.posts, page.year, page.month);
        }

        return <Fragment>
            {articleList}
            {page.total > 1 ? <Paginator
                current={page.current}
                total={page.total}
                baseUrl={page.base}
                path={config.pagination_dir}
                urlFor={url_for}
                prevTitle={__('common.prev')}
                nextTitle={__('common.next')} /> : null}
        </Fragment>;
    }
}