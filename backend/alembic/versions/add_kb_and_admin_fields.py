"""Add knowledge base tables and is_admin field

Revision ID: add_kb_admin_001
Revises: e26857373497
Create Date: 2026-05-29 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'add_kb_admin_001'
down_revision = 'e26857373497'
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()

    # ── 1. Add is_admin to users (skip if already exists) ────────────────────
    result = conn.execute(sa.text(
        "SELECT column_name FROM information_schema.columns "
        "WHERE table_name='users' AND column_name='is_admin'"
    ))
    if not result.fetchone():
        op.add_column(
            'users',
            sa.Column('is_admin', sa.Boolean(), nullable=False, server_default='false')
        )

    # ── 2. Create knowledge_base_articles (skip if already exists) ────────────
    result = conn.execute(sa.text(
        "SELECT table_name FROM information_schema.tables "
        "WHERE table_name='knowledge_base_articles'"
    ))
    if not result.fetchone():
        op.create_table(
            'knowledge_base_articles',
            sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column('title', sa.String(500), nullable=False),
            sa.Column('excerpt', sa.Text(), nullable=False),
            sa.Column('content', sa.Text(), nullable=False),
            sa.Column('category', sa.String(100), nullable=False),
            sa.Column('tags', postgresql.ARRAY(sa.String()), nullable=True),
            sa.Column('status', sa.String(50), nullable=False, server_default='published'),
            sa.Column('views', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index('ix_knowledge_base_articles_id',    'knowledge_base_articles', ['id'])
        op.create_index('ix_knowledge_base_articles_title', 'knowledge_base_articles', ['title'])
        op.create_index('idx_kb_articles_category',         'knowledge_base_articles', ['category'])
        op.create_index('idx_kb_articles_created_at',       'knowledge_base_articles', ['created_at'])
        op.create_index('idx_kb_articles_status',           'knowledge_base_articles', ['status'])
        op.create_index('idx_kb_articles_created_by',       'knowledge_base_articles', ['created_by'])
    else:
        # Table exists but may be missing status/created_by columns
        result = conn.execute(sa.text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='knowledge_base_articles' AND column_name='status'"
        ))
        if not result.fetchone():
            op.add_column('knowledge_base_articles',
                sa.Column('status', sa.String(50), nullable=False, server_default='published'))
            op.create_index('idx_kb_articles_status', 'knowledge_base_articles', ['status'])

        result = conn.execute(sa.text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='knowledge_base_articles' AND column_name='created_by'"
        ))
        if not result.fetchone():
            op.add_column('knowledge_base_articles',
                sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True))
            op.create_foreign_key(
                'fk_kb_articles_created_by',
                'knowledge_base_articles', 'users',
                ['created_by'], ['id'], ondelete='SET NULL'
            )
            op.create_index('idx_kb_articles_created_by', 'knowledge_base_articles', ['created_by'])

    # ── 3. Create knowledge_base_submissions (skip if already exists) ─────────
    result = conn.execute(sa.text(
        "SELECT table_name FROM information_schema.tables "
        "WHERE table_name='knowledge_base_submissions'"
    ))
    if not result.fetchone():
        op.create_table(
            'knowledge_base_submissions',
            sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column('title', sa.String(500), nullable=False),
            sa.Column('excerpt', sa.Text(), nullable=False),
            sa.Column('content', sa.Text(), nullable=False),
            sa.Column('category', sa.String(100), nullable=False),
            sa.Column('tags', postgresql.ARRAY(sa.String()), nullable=True),
            sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
            sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column('rejection_reason', sa.Text(), nullable=True),
            sa.Column('reviewed_by', postgresql.UUID(as_uuid=True), nullable=True),
            sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='CASCADE'),
            sa.ForeignKeyConstraint(['reviewed_by'], ['users.id'], ondelete='SET NULL'),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index('ix_knowledge_base_submissions_id', 'knowledge_base_submissions', ['id'])
        op.create_index('idx_kb_submissions_status',        'knowledge_base_submissions', ['status'])
        op.create_index('idx_kb_submissions_created_by',    'knowledge_base_submissions', ['created_by'])
        op.create_index('idx_kb_submissions_created_at',    'knowledge_base_submissions', ['created_at'])


def downgrade() -> None:
    # Drop submissions
    op.drop_index('idx_kb_submissions_created_at',    table_name='knowledge_base_submissions')
    op.drop_index('idx_kb_submissions_created_by',    table_name='knowledge_base_submissions')
    op.drop_index('idx_kb_submissions_status',        table_name='knowledge_base_submissions')
    op.drop_index('ix_knowledge_base_submissions_id', table_name='knowledge_base_submissions')
    op.drop_table('knowledge_base_submissions')

    # Drop articles
    op.drop_index('idx_kb_articles_created_by',       table_name='knowledge_base_articles')
    op.drop_index('idx_kb_articles_status',           table_name='knowledge_base_articles')
    op.drop_index('idx_kb_articles_created_at',       table_name='knowledge_base_articles')
    op.drop_index('idx_kb_articles_category',         table_name='knowledge_base_articles')
    op.drop_index('ix_knowledge_base_articles_title', table_name='knowledge_base_articles')
    op.drop_index('ix_knowledge_base_articles_id',    table_name='knowledge_base_articles')
    op.drop_table('knowledge_base_articles')

    # Drop is_admin
    op.drop_column('users', 'is_admin')
